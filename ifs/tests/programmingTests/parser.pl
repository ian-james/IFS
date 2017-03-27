#!/usr/bin/perl -w

# Justin Carvalho

use strict;
use warnings;

use IO::Handle;

use Data::Dumper;

use JSON;

use Switch;

use List::Util;

##
# Globals
#
# file to parse
my $reportfile;
# report arrays
my @sub;
my @gcclines;
my @cppchecklines;
my @idchecklines;
my @ctags;
# parsed report
my @results;
my %ctags_formatted;
my %functions;


my $submission = $ARGV[0];
__PACKAGE__->main() unless caller;

sub main {
    $reportfile = $submission.".report";
    file_to_arrays($reportfile);

    sub_to_json();
    ctags_format();
    gcc_to_json();
    cppcheck_to_json();
    idcheck_to_json();

    #FIXME: @wontfix It works, but possible bug. Json is, by spec, unordered (99)
    #       Maybe sort in php as a solution.
    @results = sort {
        $a->{'file'} cmp $b->{'file'} or
        $a->{'line'} <=> $b->{'line'}
    } @results;
    my $json;
    $json = encode_json \@results;

    my $jsonfile = $submission.".json";
    open my $fh, ">", $jsonfile;
    print $fh $json;
    close $fh;
}

##
# Subroutines
##

##
# remove_path 0
# Truncates filepath to .../filename
sub remove_path {
    my $path = shift;
    $path =~ s/$submission/./g;
    return $path;
}

##
# file_to_arrays 1
# converts file to global arrays
# 1 -> file to open for reading
sub file_to_arrays {
    my $file = shift;
    open my $report, '<', $file;
    my $state;
    $state = "";
    my $line;
    foreach $line (<$report>) {
        chomp($line);
        switch ($line) {
            case "### submission" {
                $state = "submission";
            }
            case "### syntaxCheck" {
                $state = "gcc";
            }
            case "### cppCheck" {
                $state = "cppCheck";
            }
            case "### idCheck" {
                $state = "idCheck";
            }
            case "### ctags" {
                $state = "ctags";
            }
            else {
                switch ($state) {
                    case "submission" {
                        push @sub, $line;
                    }
                    case "gcc" {
                        push @gcclines, $line;
                    }
                    case "cppCheck" {
                        push @cppchecklines, $line;
                    }
                    case "idCheck" {
                        push @idchecklines, $line;
                    }
                    case "ctags" {
                        push @ctags, $line;
                    }
                }
            }

        }
    }
    close $report;
}

sub gcc_to_json {
    for (@gcclines) {
        my %data;
        my $tagdata;

        if (m/^(.*?)from (.*)$/) #In file included from...
        {
            next;
        }
        elsif (m/^(.*?):([0-9]+):(.*)$/) # filename:lineno:message
        {
            my $field1 = $1 || "";
            my $field2 = $2 || "";
            my $field3 = $3 || "";
            my $id;

            $field3 =~ s/^([0-9]+)://; # remove column if any

            if ($field3 =~ m/\s+warning:.*/)
            {
                $field3 =~ s/warning://;
                # Warning

                $field3 =~ s/\[-(.+)\]$//; # remove warning tag [-Wno...]
                $id = $field3;

                # print("WARNING FILENAME: ", "$field1");
                # print(", LINE: ", "$field2");
                # print(", MESSAGE:", "$field3");
                %data = (
                    file => $field1,
                    line => $field2,
                    msg => $field3,
                    checker => "gcc",
                    keyw => "warning (syntax)"
                );
            } elsif ($field3 =~ m/\s+fatal[ ]error:.*/) {
                $field3 =~ s/fatal[ ]error://;
                $id = $field3;
                # Error
                # print("FATAL FILENAME: ", "$field1");
                # print(", LINE: ", "$field2");
                # print(", MESSAGE:", "$field3");
                %data = (
                    file => $field1,
                    line => $field2,
                    msg => $field3 . '<br/><b>Note:</b> This error has prevented the syntax checker from continuing, and will prevent your code from compiling.',
                    checker => "gcc",
                    keyw => "fatal error (syntax)"
                );
            } elsif ($field3 =~ m/\s+note:.*/) {
                #Note
                #current doesn't handle these
                next;
            }
            else
            {
                $field3 =~ s/error://;
                $id = $field3;
                # Error
                # print("ERROR FILENAME: ", "$field1:");
                # print(", LINE: ", "$field2:");
                # print(", MESSAGE:", "$field3");
                %data = (
                    file => $field1,
                    line => $field2,
                    msg => $field3 . '<br/><b>Note:</b> This error may result in additional syntax errors being reported in later lines, and will prevent your code from compiling.',
                    checker => "gcc",
                    keyw => "error (syntax)"
                );
            }

            $id =~ s/\s+//g;
            $id =~ s/'.+'//g;
            $data{'id'} = $id;

        }
        else # Anything else.
        {
            # Doesn't seem to be a warning or an error.
            next;
        }
        #print("\n");

        # if (/compilation terminated./) {
        #     print("kkkk");
        # }
        # elsif (/^([^:]+): (In function) ([^:]+):$/) {
        #     next;
        #     #$tagdata = first {$_->{'identifier'} == "main"} @ctags_formatted;
        #     # my $item = grep {
        #     #     $_->{'identifier'} cmp $3 and
        #     #     $_->{'file'} cmp $1
        #     # } @ctags_formatted;
        #     # %data = (
        #     #     file => $1,
        #     #     line => $ctags_formatted{$1.$3},
        #     #     code => $ctags_formatted{$1.$3."code"},
        #     #     function => $3,
        #     #     type => 4
        #     # );
        # } elsif (/^([\w\s]+from) ([^:]+):(\d+)(:|,)$/){
        #     %data = (
        #         msg => $1,
        #         file => $2,
        #         line => $3,
        #         eoli => $4,
        #         type => 2
        #     );
        # } elsif (/^([^:]+):(?:((?:\d+:)?\d+): )?(?:(error|warning|note): )?(.+)$/) {
        #     %data = (
        #         type => 1,
        #         file => $1,
        #     );
        #     $data{'line'} = $2 if defined $2;
        #     $data{'keyw'} = $3 if defined $3;
        #     my $rest = $4;
        #     $rest =~ s/ \[-W.+\]//; #remove things like [-Wunused]
        #     $data{'msg'} = $rest;
        # } else {
        #     if (! $results[$#results]{'code'}) {
        #         $results[$#results]{'code'} = "$_";
        #     } else {
        #         $results[$#results]{'code2'} = "$_";
        #     }
        #     next;
        # }
        # $data{'checker'} = "gcc";

        # if ($data{'line'}) {
        #     if ($data{'line'} =~ /([0-9]+)(:([0-9]+))?/) {
        #         $data{'line'} = $1;
        #         $data{'col'} = $3 if defined $3;
        #     }
        # }

        $data{'file'} = remove_path $data{'file'} if $data{'file'};

        # print Dumper(\%data);

        push @results, \%data;
    }

}

sub cppcheck_to_json {
    for (@cppchecklines) {

        my %data;

        /^([^#]+)##([^#]+)##([^#]+)##([^#]+)##([^#]+)$/;

        %data = (
            file => $1,
            line => $2,
            keyw => $3,
            msg => $4,
            id => $5,
            checker => "cppcheck"
        );

        $data{'file'} = remove_path $data{'file'} if $data{'file'};

        push @results, \%data;
    }
}

sub sub_to_json {
    my %data = (
        file => "_",
        line => 0,
        checker => "submission",
        numc => $sub[0],
        numh => $sub[1]
    );

    push @results, \%data;
}

sub idcheck_to_json {
    for (@idchecklines) {

        my %data;

        /^([^#]+)##([^#]+)##([^#]+)##([^#]+)##([^#]+)$/;

        %data = (
            file => $1,
            line => $2,
            keyw => $3,
            msg => $4,
            id => $5,
            checker => "idcheck"
        );

        $data{'file'} = remove_path $data{'file'} if $data{'file'};

        push @results, \%data;
    }
}

#FIXME: @wontfix breaks with two functions of the same name in the same file
sub ctags_format {
    my $prevData;
    for (my $i=0; $i < @ctags; $i++) {

        $ctags[$i] =~ /^(\S+)\s+([\S]+)\s+([\S]+)\s+([\S]+)\s+(.*)$/;

        if ($2 eq "member") {
            next;
        }

        my %data;
        $data{'line'} = $3 - 0.1; #hack for sort
        $data{'type'} = $2;
        $data{'identifier'} = $1;
        $data{'lineEnd'} = 99999;
        $data{'file'} = remove_path $4;
        $data{'code'} = $5;
        $data{'checker'} = "ctags";
        if ($5 eq "@") {
            $data{'lineEnd'} = 0.2;
        } elsif ($i > 0) {
            if ($4 eq $prevData->{'file'}) {
                $prevData->{'lineEnd'} = $3;
            }
        }
        $prevData = \%data;

        push @results, \%data;
    }

}